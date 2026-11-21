
import React, { useEffect, useState, useCallback } from 'react';
import {
  Code2, Sparkles, Zap, BrainCircuit,
  GraduationCap, ArrowRight
} from 'lucide-react';
import './SplashScreen.css';

function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Starting your experience');

  const finish = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const steps = [
      [15, 'Initializing SkillMate AI...'],
      [35, 'Preparing smart learning tools...'],
      [60, 'Loading your workspace...'],
      [85, 'Connecting all components...'],
      [100, 'Your learning space is ready!']
    ];

    let index = 0;

    const timer = setInterval(() => {
      if (index >= steps.length) {
        clearInterval(timer);
        return;
      }

      setProgress(steps[index][0]);
      setStatus(steps[index][1]);
      index++;

      if (index === steps.length) {
        clearInterval(timer);
        setTimeout(finish, 500);
      }
    }, 450);

    return () => clearInterval(timer);
  }, [finish]);

  return (
    <div className="splash-screen">

      <div className="splash-grid"></div>
      <div className="splash-orb orb-one"></div>
      <div className="splash-orb orb-two"></div>
      <div className="splash-orb orb-three"></div>

      <div className="floating-code code-one">&lt;/&gt;</div>
      <div className="floating-code code-two">{'{ AI }'}</div>
      <div className="floating-code code-three">010101</div>
      <div className="floating-code code-four">const future = true;</div>

      <div className="splash-main">

        <div className="splash-top">
          <div className="brand-mark">
            <Code2 size={23} />
          </div>
          <span>SKILLMATE <b>AI</b></span>
          <div className="online-status">
            <span></span> SYSTEM ONLINE
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-outer"></div>
          <div className="orbit orbit-inner"></div>

          <div className="hero-icon">
            <BrainCircuit size={56} strokeWidth={1.5} />
            <Sparkles className="hero-spark" size={22} />
          </div>

          <div className="mini-icon mini-one">
            <Code2 size={19} />
          </div>
          <div className="mini-icon mini-two">
            <GraduationCap size={20} />
          </div>
          <div className="mini-icon mini-three">
            <Zap size={18} />
          </div>
        </div>

        <div className="welcome-label">
          <Sparkles size={14} />
          WELCOME TO YOUR NEXT CHAPTER
        </div>

        <h1>
          Learn Smarter.<br />
          <span>Achieve More.</span>
        </h1>

        <p className="hero-description">
          Your AI-powered companion for learning,
          <br className="desktop-break" />
          skill development and career growth.
        </p>

        <div className="loading-panel">

          <div className="loading-top">
            <div className="loading-info">
              <span className="loading-dot"></span>
              <span>{status}</span>
            </div>
            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            >
              <span></span>
            </div>
          </div>

          <div className="loading-bottom">
            <span>PLEASE WAIT</span>
            <span>POWERED BY SKILLMATE AI</span>
          </div>

        </div>

        <div className="hero-footer">
          <div><Zap size={15} /> Smart Learning</div>
          <div><BrainCircuit size={15} /> AI Powered</div>
          <div><GraduationCap size={16} /> Career Growth</div>
        </div>

      </div>

      <div className="splash-bottom">
        <span>DESIGNED TO HELP YOU GROW</span>
        <span>VERSION 1.0</span>
      </div>

    </div>
  );
}

export default SplashScreen;
