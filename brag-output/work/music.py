import numpy as np, wave, sys
SR = 48000; DUR = 20.0; N = int(SR*DUR)
t = np.arange(N)/SR
BPM = 112; B = 60/BPM
def hz(m): return 440*2**((m-69)/12)
def lp(x, a):  # one-pole lowpass
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a*(x[i]-acc); y[i] = acc
    return y
def env(n, a, r):
    e = np.ones(n); A = int(a*SR); R = int(r*SR)
    if A: e[:A] = np.linspace(0,1,A)
    if R: e[-R:] *= np.linspace(1,0,R)
    return e
L = np.zeros(N); Rch = np.zeros(N)
def add(sig, start, gain=1.0, pan=0.0):
    s = int(start*SR); e = min(N, s+len(sig)); sig = sig[:e-s]*gain
    L[s:e] += sig*(1-pan)*0.5*2**0.5; Rch[s:e] += sig*(1+pan)*0.5*2**0.5
# progression Am F C G, 2 bars each
chords = [[57,60,64],[53,57,60],[48,55,64],[55,59,62]]
roots = [45,41,48,43]
bar = 4*B
# pad
for k in range(int(DUR/(2*bar))+1):
    st = k*2*bar; ln = 2*bar+0.4; n = int(ln*SR); tt = np.arange(n)/SR
    ch = chords[k%4]; sig = np.zeros(n)
    for m in ch+[ch[0]+12]:
        for d in (-0.08, 0.08):
            f = hz(m+d); sig += 2*((tt*f)%1)-1
    sig = lp(sig/10, 0.05)*env(n,0.35,0.5)
    add(sig, st, 0.22, 0.0)
# bass + drums from 3.0s
drum_start = 3.0
nb = int((DUR-drum_start)/B)
for i in range(nb):
    st = drum_start + i*B
    if st > 19.2: break
    k = int(st/(2*bar)) % 4
    # kick
    n = int(0.35*SR); tt = np.arange(n)/SR
    f = 50+90*np.exp(-tt*28); ph = 2*np.pi*np.cumsum(f)/SR
    add(np.sin(ph)*np.exp(-tt*9), st, 0.55)
    # bass (8th notes)
    for h in (0, B/2):
        n = int(B/2*SR); tt = np.arange(n)/SR
        b = np.sin(2*np.pi*hz(roots[k])*tt) + 0.3*np.sin(2*np.pi*hz(roots[k]+12)*tt)
        add(b*env(n,0.005,0.08)*np.exp(-tt*3), st+h, 0.22)
    # hat on offbeat
    n = int(0.06*SR); nz = np.random.default_rng(i).standard_normal(n)
    hat = (nz - lp(nz,0.5))*np.exp(-np.arange(n)/SR*60)
    add(hat, st+B/2, 0.05, 0.3)
    # snare-ish clap on 2 and 4
    if i % 2 == 1:
        n = int(0.18*SR); nz = np.random.default_rng(100+i).standard_normal(n)
        cl = lp(nz,0.35)*np.exp(-np.arange(n)/SR*22)
        add(cl, st, 0.10, -0.15)
# SFX (in A)
rng = np.random.default_rng(7)
def blip(f, dur, decay):
    n = int(dur*SR); tt = np.arange(n)/SR
    return np.sin(2*np.pi*f*tt)*np.exp(-tt*decay)*env(n,0.003,0.01)
def whoosh(dur=0.45):
    n = int(dur*SR); nz = rng.standard_normal(n)
    sh = np.sin(np.linspace(0,np.pi,n))**2
    return lp(nz,0.08)*sh
# typing ticks (chat + prompt)
for i in range(56): add(blip(hz(93 if i%3 else 88),0.03,180), 0.3+i*0.026, 0.035, 0.2*((i%2)*2-1))
for i in range(22): add(blip(hz(93),0.03,180), 6.95+i*0.022, 0.03)
for ts in (2.85, 6.3, 10.35, 14.35, 16.85): add(whoosh(), ts, 0.25)
add(blip(hz(45),0.6,6)*1.0, 3.02, 0.35)            # reveal low thump
for i,ts in enumerate([7.6,7.88,8.16,8.44]): add(blip(hz(81),0.12,40), ts, 0.07)
for m in (81, 88, 93): add(blip(hz(m),1.2,4), 8.85+(m-81)*0.004, 0.08)   # ready chime A5 E6 A6
for i,(ts,m) in enumerate([(10.6,69),(10.78,72),(10.96,76)]): add(blip(hz(m),0.25,18), ts, 0.14)
for i,ts in enumerate([15.3,15.46,15.62]): add(blip(hz([76,79,81][i]),0.2,22), ts, 0.10)
# outro chord swell
n = int(3.0*SR); tt = np.arange(n)/SR; sw = np.zeros(n)
for m in (57,64,69,72,76): sw += np.sin(2*np.pi*hz(m)*tt)
add(sw/5*env(n,0.08,1.6), 17.05, 0.22)
mix = np.stack([L,Rch],1)
# master fade
fo = int(1.0*SR); mix[-fo:] *= np.linspace(1,0,fo)[:,None]
fi = int(0.05*SR); mix[:fi] *= np.linspace(0,1,fi)[:,None]
mix = np.tanh(mix*1.1)
mix *= 0.89/np.abs(mix).max()
pcm = (mix*32767).astype(np.int16)
with wave.open(sys.argv[1],"wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok", pcm.shape)
