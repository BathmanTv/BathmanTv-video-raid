"""Bande-son de la strat express : voix off + fond musical discret + bruitages.

    python3 mix.py            # → out/final.wav (48 kHz, 24 bits, stéréo)

Le fond est composé en fa mineur à 72 BPM, comme le showreel GIDEON, et s'efface sous la voix
(compression par la voix). Les bruitages reprennent les instants de video.js : mêmes phrases, même
estimation du moment où un mot est prononcé. Le volume de publication (−16 LUFS) est réglé à la
livraison par finalize_delivery.sh. Nécessite numpy et scipy.
"""
import json
import os
import re
import wave

import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
BEAT = 60 / 72
rng = np.random.default_rng(12)

tl = json.load(open(os.path.join(HERE, 'vo', 'out', 'timeline.json'), encoding='utf-8'))
L, DUR = tl['lines'], tl['duration']
N = int(DUR * SR) + SR


def plain(s):
    return re.sub(r'\{\w:([^}]*)\}', r'\1', s)


def st(i):
    return L[i]['start']


def en(i):
    return L[i]['end']


def at(i, needle, off=0.0):
    p = plain(L[i]['text'])
    k = p.index(needle)
    return st(i) + (en(i) - st(i)) * (k / len(p)) + off


# bornes des plans (identiques à video.js)
B = {'hook': st(1) - 0.6, 'map': st(2) - 0.4, 'det': st(9) - 0.6, 'inf': st(13) - 0.6, 'fang': st(17) - 0.8,
     'froth': st(18) - 0.6, 'bile': st(19) - 0.6, 'tum': st(20) - 0.7, 'out': st(22) - 0.9}


def read_wav(path):
    with wave.open(path) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
        assert w.getframerate() == SR
    return x


# ─── synthèse ───
def tt(d):
    return np.arange(int(d * SR)) / SR


def noise(d):
    return rng.standard_normal(int(d * SR))


def filt(x, kind, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype=kind, fs=SR, output='sos'), x)


def env(d, a=0.002, r=0.2):
    t = tt(d)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def saw(f, d, detune=0.0):
    t = tt(d)
    ph = (t * f * (1 + detune) + rng.random()) % 1.0
    return 2 * ph - 1


def sine(f, d):
    f = np.broadcast_to(np.asarray(f, float), (int(d * SR),))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


mix = np.zeros((2, N))
bed = np.zeros((2, N))


def add(buf, t0, gain=1.0, pan=0.0, bus=None):
    bus = mix if bus is None else bus
    i0 = int(round(t0 * SR))
    if i0 >= N:
        return
    if buf.ndim == 1:
        a = (pan + 1) * np.pi / 4
        buf = np.vstack([buf * np.cos(a), buf * np.sin(a)])
    n = min(buf.shape[1], N - i0)
    bus[:, i0:i0 + n] += buf[:, :n] * gain


def whoosh(t0, d=0.5, f0=400, f1=3000, gain=0.12, pan0=-0.3, pan1=0.3):
    t = tt(d)
    x = noise(d)
    y = np.zeros_like(x)
    for s in range(0, len(x), 512):                      # passe-bande qui glisse
        f = f0 * (f1 / f0) ** (s / len(x))
        y[s:s + 512] = filt(x[s:s + 512], 'bandpass', [f * 0.7, f * 1.4])
    shape = np.sin(np.pi * t / d) ** 2
    y = y / (np.abs(y).max() + 1e-9) * shape
    a = (np.linspace(pan0, pan1, len(y)) + 1) * np.pi / 4
    add(np.vstack([y * np.cos(a), y * np.sin(a)]), t0, gain)


def bell(t0, n, gain=0.08, d=1.6, pan=0.0):
    t = tt(d)
    f = midi(n)
    y = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.2)) * env(d, 0.001, d / 4)
    add(y, t0, gain, pan)


def pop(t0, f=600, gain=0.08, pan=0.0):
    d = 0.14
    t = tt(d)
    add(sine(f * (0.6 + 1.1 * (1 - np.exp(-t / 0.02))), d) * env(d, 0.001, 0.04), t0, gain, pan)


def tick(t0, gain=0.06, f=3500, pan=0.0):
    add(filt(noise(0.015), 'bandpass', [f * 0.7, f * 1.4]) * env(0.015, 0.0002, 0.003), t0, gain, pan)


def boom(t0, gain=0.3, big=False):
    d = 1.4 if big else 0.9
    t = tt(d)
    f = 38 + (120 if big else 90) * np.exp(-t / 0.05)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.45 if big else 0.3))
    y = np.tanh(1.6 * body) + filt(noise(d), 'lowpass', 500) * env(d, 0.002, 0.2) * 0.4
    add(y, t0, gain)


def swell(t0, d=1.2, gain=0.08):
    t = tt(d)
    y = filt(noise(d), 'bandpass', [300, 2200]) * (t / d) ** 2
    add(y / (np.abs(y).max() + 1e-9), t0, gain)


def shh(t0, d=0.7, gain=0.07):                            # le « chut » de Gideon
    add(filt(noise(d), 'bandpass', [2500, 6500]) * np.sin(np.pi * tt(d) / d) ** 1.5, t0, gain)


# ─── fond musical : pads + basse + arpège discret, fa mineur, 72 BPM ───
CHORDS = [('Fm', [53, 56, 60, 63], 41), ('Db', [49, 53, 56, 60], 37), ('Ab', [56, 60, 63, 67], 44), ('Eb', [51, 55, 58, 62], 39)]
bar = 4 * BEAT
k = 0
t0 = 0.0
while t0 < DUR:
    name, notes, root = CHORDS[k % 4]
    d = 2 * bar
    t = tt(d)
    pad = sum(saw(midi(n), d, dt) for n in notes for dt in (-0.006, 0.0, 0.006))
    pad = filt(pad, 'lowpass', 900)
    pad = filt(pad, 'highpass', 150)
    pad *= np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 0.8)
    add(np.vstack([pad, np.roll(pad, 331)]), t0, 0.012, bus=bed)
    sub = sine(midi(root - 12), d) * np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6)
    add(sub, t0, 0.07, bus=bed)
    for j in range(16):                                   # arpège en croches, très bas
        n = [notes[0], notes[2], notes[1], notes[3]][j % 4] + 12
        dd = 0.28
        y = (saw(midi(n), dd) + saw(midi(n), dd, 0.005)) * env(dd, 0.002, 0.07)
        y = filt(y, 'lowpass', 2400)
        add(y, t0 + j * BEAT / 2, 0.018, pan=0.35 * np.sin(j * 0.9), bus=bed)
    t0 += d
    k += 1
for j in range(int(DUR / BEAT)):                          # pulsation douce sur les temps
    tb = j * BEAT
    t = tt(0.3)
    kick = np.sin(2 * np.pi * np.cumsum(45 + 70 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.18)
    add(kick, tb, 0.10 if j % 2 == 0 else 0.06, bus=bed)

voice = read_wav(os.path.join(HERE, 'vo', 'out', 'voice.wav'))
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
# le fond s'efface sous la voix (≈ −9 dB), revient dans les silences
v_env = np.abs(voice)
v_env = signal.sosfiltfilt(signal.butter(2, 3, fs=SR, output='sos'), v_env)
duck = 1 - 0.65 * np.clip(v_env / 0.08, 0, 1)
bed *= duck
fade = np.ones(N)
fi, fo = int(0.8 * SR), int(DUR * SR)
fade[:fi] = np.linspace(0, 1, fi)
fade[fo - int(3 * SR):fo] = np.linspace(1, 0, int(3 * SR))
fade[fo:] = 0
bed *= fade

# ─── bruitages, calés sur video.js ───
whoosh(0.3, 0.8, 300, 2500, 0.10)
for i, n in enumerate([65, 68, 72]):
    bell(2.0 + i * 0.18, n + 12, 0.05, 1.4, -0.3 + 0.3 * i)
for key in ('hook', 'map', 'det', 'inf', 'fang', 'froth', 'bile', 'tum', 'out'):
    whoosh(B[key] - 0.15, 0.55, 500, 3500, 0.09)
whoosh(st(3) - 0.3, 0.9, 250, 2000, 0.10, 0.4, -0.2)       # l'encart devient le plan plein écran
for f, n in (('Sang', 65), ('Ombre', 68), ('Flamme', 72)):
    bell(at(2, f), n + 12, 0.07, 1.4)
boom(at(3, 'Cavité') - 0.1, 0.18)
t_in, t_d1 = at(4, 'Vashnik') - 0.3, at(4, 'boit') - 0.2
t_m1, t_m2 = st(5) + 1.3, st(5) + 3.3
whoosh(t_in, 1.2, 200, 1200, 0.08)
for td in (t_d1, t_m1 + 1.0, t_m2 + 1.0):
    swell(td - 1.0, 1.0, 0.06)
    bell(td, 60, 0.05, 1.0)
for tm in (t_m1, t_m2):
    whoosh(tm, 0.9, 250, 1500, 0.06, -0.4, 0.4)
arr1, arr2 = at(7, 'atteint') + 0.5, at(7, 'Deux') + 0.3
boom(arr1, 0.22)
boom(arr2, 0.42, big=True)
v3a, v3h = st(8) + 0.2, at(8, 'insensible')
for j in range(12):
    tick(v3a + (v3h - v3a) * j / 12, 0.05, 2500 + 100 * j, -0.3)
bell(v3h, 77, 0.06, 1.2)
# les trois venins
t_split, t_kill = at(9, 'divise') - 0.1, at(9, 'Tuez')
pop(t_split, 500, 0.1)
pop(t_split + 0.9, 650, 0.09)
for j in range(4):
    tick(t_kill + j * 0.3, 0.08, 1800)
sw1 = st(10) - 0.5
for j in range(5):
    pop(sw1 + 0.5 + j * 0.15, 520 + 40 * j, 0.06, -0.5 + 0.25 * j)
t_sh = at(10, 'deux fois') - 0.2
for j in range(5):
    tick(t_sh + j * 0.12, 0.05, 4200, 0.2)
    tick(t_sh + 0.9 + j * 0.12, 0.05, 2400, 0.2)
t_ctl, t_k2 = at(12, 'contrôle') - 0.1, at(12, 'tue le second')
bell(t_ctl, 84, 0.05, 0.8, -0.4)
boom(t_k2 + 0.9, 0.2)
t_chut = at(12, 'Jamais') - 0.1
shh(t_chut + 0.1)
# infections
for j in range(3):
    pop(B['inf'] + 0.2 + j * 0.2, 480 + 60 * j, 0.06, -0.6 + 0.6 * j)
t_f = at(16, 'étale')
for j in range(3):
    tick(t_f - 0.2 + j * 0.6, 0.09, 1600, 0.6)
# réflexes de fond
t_sw = at(17, 'swap') - 0.1
boom(t_sw, 0.14)
whoosh(t_sw + 0.6, 0.9, 400, 1800, 0.06, -0.5, 0.5)
t_w = en(18) + 0.1
whoosh(t_w, 0.7, 300, 4000, 0.10)
t_boom = at(19, 'impact') - 0.1
swell(t_boom - 1.0, 1.0, 0.05)
boom(t_boom, 0.2)
t_spread = at(19, 'On s’étale') - 0.2
for j in range(6):
    tick(t_spread + 1.0 + j * 0.12, 0.07, 3000 + 150 * j)
# Mythique
t_app, t_wave = at(20, 'tumeurs') - 0.2, at(21, 'détruisent') - 0.1
for j in range(5):
    pop(t_app + j * 0.2, 300 + 30 * j, 0.07)
boom(at(20, 'Malveillance') - 0.2, 0.16)
for j in range(3):
    whoosh(t_wave + j * 0.5, 0.6, 300, 3000, 0.06)
for j, (w, i) in enumerate([(0, 0), (0, 1), (1, 2), (2, 4)]):
    tick(t_wave + 0.35 + w * 0.5 + (i % 2) * 0.2, 0.08, 2000)
# fin
for i, n in enumerate([65, 68, 72, 77]):
    bell(at(22, 'Et Vashnik') + i * 0.06, n + 12, 0.05, 2.2, -0.3 + 0.2 * i)

out = mix + bed + np.vstack([voice, voice]) * 0.9
out = filt(out, 'highpass', 30)
out /= np.abs(out).max() + 1e-9
out = np.tanh(out * 1.3) / np.tanh(1.3) * 0.89
out = out[:, :int((np.ceil(DUR * 30) / 30 + 0.1) * SR)]       # un peu au-delà de la dernière image : -shortest garde la vidéo entière
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
pcm = (np.clip(out.T, -1, 1) * (2 ** 23 - 1)).astype(np.int32)
raw = np.ascontiguousarray(pcm, dtype='<i4').view(np.uint8).reshape(-1, 4)[:, :3].tobytes()   # 24 bits petit-boutiste
with wave.open(os.path.join(HERE, 'out', 'final.wav'), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(3)
    w.setframerate(SR)
    w.writeframes(raw)
print(f'out/final.wav · {DUR:.2f} s')
