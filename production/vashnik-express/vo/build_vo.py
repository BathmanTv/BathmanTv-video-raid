"""Voix off de la strat express : une synthèse Kokoro par phrase, puis montage sur une piste.

    KOKORO_DIR=/chemin/vers/modeles python3 vo/build_vo.py

Écrit vo/out/voice.wav (48 kHz mono), vo/out/timeline.json et vo/out/data.js (début/fin de
chaque phrase, en secondes) et vo/out/env.json (enveloppe de la voix, 30 valeurs par seconde, pour faire briller
les yeux et les gemmes de Gideon). Les modèles (kokoro-v1.0.onnx, voices-v1.0.bin) ne sont pas
versionnés : ils viennent de github.com/thewh1teagle/kokoro-onnx (release model-files-v1.0).
"""
import json
import os
import re
import wave

import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
MODELS = os.environ.get('KOKORO_DIR', os.path.join(HERE, 'models'))
SR = 48000
FPS = 30
LEAD = 3.0           # le carton d'intro s'installe avant la première phrase
GAP = 0.5            # entre deux phrases d'une même scène
GAP_SCENE = 1.4      # entre deux scènes
TAIL = 5.0           # le carton de fin reste après la dernière phrase

os.makedirs(OUT, exist_ok=True)
script = json.load(open(os.path.join(HERE, 'script.json'), encoding='utf-8'))


def plain(s):
    return re.sub(r'\{\w:([^}]*)\}', r'\1', s)


def trim(x, sr, thr=0.012, pad=0.04):
    """Coupe le silence en tête et en queue d'une phrase synthétisée."""
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a, b = max(0, idx[0] - int(pad * sr)), min(len(x), idx[-1] + int(pad * sr))
    return x[a:b]


from kokoro_onnx import Kokoro  # noqa: E402  (import tardif : lourd)

k = Kokoro(os.path.join(MODELS, 'kokoro-v1.0.onnx'), os.path.join(MODELS, 'voices-v1.0.bin'))
clips = []
for i, line in enumerate(script['lines']):
    say = line.get('say', plain(line['text']))
    x, sr = k.create(say, voice=script['voice'], speed=script['speed'], lang='fr-fr')
    x = trim(np.asarray(x, np.float32), sr)
    x = signal.resample_poly(x, SR, sr).astype(np.float32)
    clips.append(x)
    print(f'{i:02d} {len(x) / SR:5.2f}s  {plain(line["text"])[:70]}')

t = LEAD
timeline = []
for i, (line, x) in enumerate(zip(script['lines'], clips)):
    if i:
        prev = script['lines'][i - 1]
        t += prev.get('hold', 0) + (GAP_SCENE if line['scene'] != prev['scene'] else GAP)
    timeline.append({'i': i, 'scene': line['scene'], 'text': line['text'], 'start': round(t, 3), 'end': round(t + len(x) / SR, 3)})
    t += len(x) / SR
dur = t + script['lines'][-1].get('hold', 0) + TAIL

voice = np.zeros(int(dur * SR) + 1, np.float32)
for item, x in zip(timeline, clips):
    i0 = int(round(item['start'] * SR))
    voice[i0:i0 + len(x)] += x
voice /= np.abs(voice).max() + 1e-9
voice *= 0.89

pcm = (voice * 32767).astype('<i2')
with wave.open(os.path.join(OUT, 'voice.wav'), 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

hop = SR // FPS
n = int(np.ceil(len(voice) / hop))
rms = np.array([np.sqrt(np.mean(voice[j * hop:(j + 1) * hop] ** 2)) for j in range(n)])
env = np.clip(rms / (np.percentile(rms[rms > 0.01], 95) if (rms > 0.01).any() else 1), 0, 1)
env = np.convolve(env, [0.25, 0.5, 0.25], mode='same')
json.dump({'fps': FPS, 'env': [round(float(v), 3) for v in env]}, open(os.path.join(OUT, 'env.json'), 'w'))
json.dump({'duration': round(dur, 3), 'lines': timeline}, open(os.path.join(OUT, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'data.js'), 'w', encoding='utf-8') as f:   # chargé par index.html
    f.write('window.TL = ' + json.dumps({'duration': round(dur, 3), 'lines': timeline}, ensure_ascii=False) + ';\n')
    f.write('window.ENV = ' + json.dumps([round(float(v), 3) for v in env]) + ';\n')
print(f'durée totale {dur:.2f} s ({int(dur // 60)}:{dur % 60:04.1f})')
