import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GraduationCap, ArrowRight, CheckCircle, Lock, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const modules = [
  {
    id: 'intro',
    title: 'Intro to Wealth',
    description: 'Learn the core principles of Capital Alpha and the path to becoming a mogul.',
    content: 'The journey to wealth starts with understanding assets vs liabilities. Assets put money in your pocket, while liabilities take money out. In Capital Alpha, you start with $10,000 to invest in assets.',
    quiz: {
      question: 'What is the primary difference between an asset and a liability?',
      options: [
        'Assets are cheaper than liabilities',
        'Assets generate income, while liabilities cost money',
        'Liabilities are only for people with low credit scores',
        'There is no difference in Capital Alpha'
      ],
      answer: 1
    }
  },
  {
    id: 'charts',
    title: 'Reading the Tape',
    description: 'Understand how to read price action and historical charts.',
    content: 'Price action is the most honest indicator. Area charts show you the visual history of an asset price over different timeframes like 24h, 7d, or 90d.',
    quiz: {
      question: 'What does a 90d area chart primarily show?',
      options: [
        'The profit you will make in 90 days',
        'The historical price movement over the last 90 days',
        'The number of people trading the coin',
        'Your total portfolio value'
      ],
      answer: 1
    }
  },
  {
    id: 'risk',
    title: 'Risk Management',
    description: 'The secret to long-term success is not losing all your capital.',
    content: 'Never bet your entire portfolio on a single trade. This is called "going all in" and is a recipe for disaster. Diversification across crypto, stocks, and businesses is key.',
    quiz: {
      question: 'What is the best way to manage risk?',
      options: [
        'Wait for the price to drop 90%',
        'Invest all your cash in one high-growth coin',
        'Diversify your holdings across different asset classes',
        'Never sell, even if the price is dropping'
      ],
      answer: 2
    }
  },
  {
    id: 'dividends',
    title: 'Passive Income: Dividends',
    description: 'Earn money just for owning a piece of a profitable company.',
    content: 'Some stocks pay out a portion of their earnings to shareholders. This is called a dividend. It is a powerful way to build passive wealth and reinvest for compound growth.',
    quiz: {
      question: 'What is a dividend?',
      options: [
        'A fee you pay to the stock exchange',
        'A portion of company profits paid to shareholders',
        'The cost of buying a single share',
        'A loan from the bank'
      ],
      answer: 1
    }
  },
  {
    id: 'diversification',
    title: 'Power of Diversification',
    description: 'Don\'t put all your eggs in one basket.',
    content: 'Spreading your investments across different sectors and asset classes (Crypto, Stocks, Businesses) protects you if one market crashes.',
    quiz: {
      question: 'Why is diversification important?',
      options: [
        'It guarantees 100% win rate',
        'It reduces the impact of a single asset underperforming',
        'It allows you to trade without any cash',
        'It makes the charts look better'
      ],
      answer: 1
    }
  },
  {
    id: 'leverage',
    title: 'The Double-Edged Sword: Leverage',
    description: 'Using borrowed money to increase potential returns (and risks).',
    content: 'Leverage allows you to control larger assets with less of your own cash. However, it also amplifies losses and comes with interest costs.',
    quiz: {
      question: 'What is a primary risk of using leverage?',
      options: [
        'Your credit score might increase too fast',
        'You have to pay interest and could lose more than your initial investment',
        'The bank might give you too much money',
        'You can only use it for crypto'
      ],
      answer: 1
    }
  },
  {
    id: 'psychology',
    title: 'Trading Psychology',
    description: 'Master your emotions to master the market.',
    content: 'FOMO (Fear Of Missing Out) and Panic Selling are the two biggest killers of wealth. Stick to your plan and stay disciplined.',
    quiz: {
      question: 'What does FOMO stand for in trading?',
      options: [
        'Financial Options Market Order',
        'Fear Of Missing Out',
        'Fixed Output Managed Operation',
        'Fast Open Market Opportunity'
      ],
      answer: 1
    }
  },
  {
    id: 'compound',
    title: 'The 8th Wonder: Compounding',
    description: 'Reinvesting your earnings to generate even more earnings.',
    content: 'Compounding is the process where the value of an investment increases because the earnings on an investment, both capital gains and interest, earn interest as time passes.',
    quiz: {
      question: 'How does compounding work?',
      options: [
        'You only earn money on your initial deposit',
        'You earn money on your initial investment plus previous earnings',
        'The bank doubles your money every year for free',
        'It only works for business owners'
      ],
      answer: 1
    }
  }
];

const Learn: React.FC = () => {
  const { portfolio, setPortfolio, addCash } = useGameStore();
  const [activeModule, setActiveModule] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const completedCount = portfolio.lessons_completed.length;
  const currentModule = modules[activeModule];
  const isCompleted = portfolio.lessons_completed.includes(currentModule.id);

  const handleNext = () => {
    if (activeModule < modules.length - 1) {
      setActiveModule(activeModule + 1);
      setShowQuiz(false);
      setSelectedOption(null);
      setIsCorrect(null);
    } else if (completedCount === modules.length) {
      setPortfolio({ onboarding_completed: true });
      addCash(1000); // Completion bonus
    }
  };

  const handleQuizSubmit = () => {
    if (selectedOption === currentModule.quiz.answer) {
      setIsCorrect(true);
      if (!isCompleted) {
        setPortfolio({
          lessons_completed: [...portfolio.lessons_completed, currentModule.id]
        });
      }
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/20 text-primary rounded-2xl border border-primary/20">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learn & Grow</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-tight">Module {activeModule + 1} of {modules.length}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {modules.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setActiveModule(idx)}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
              idx === activeModule
                ? "bg-primary border-primary text-white"
                : portfolio.lessons_completed.includes(m.id)
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-card border-muted text-muted-foreground"
            }`}
          >
            {portfolio.lessons_completed.includes(m.id) ? <CheckCircle size={16} /> : idx + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key={currentModule.id + "content"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-card border border-muted p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">{currentModule.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{currentModule.content}</p>
              <div className="bg-muted/50 p-4 rounded-2xl border border-muted">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Key Takeaway</h4>
                <p className="text-xs font-medium leading-relaxed">{currentModule.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            >
              Take Module Quiz <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={currentModule.id + "quiz"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-card border border-muted p-6 rounded-3xl">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Simulation Quiz</h3>
              <p className="font-bold text-lg leading-snug mb-8">{currentModule.quiz.question}</p>

              <div className="space-y-3">
                {currentModule.quiz.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    disabled={isCorrect === true}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-medium transition-all border-2 ${
                      selectedOption === idx
                        ? isCorrect === true
                          ? "bg-primary/20 border-primary text-primary"
                          : isCorrect === false
                            ? "bg-red-500/10 border-red-500 text-red-500"
                            : "bg-accent/20 border-accent text-accent"
                        : "bg-card border-muted hover:border-muted-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {isCorrect === true && (
                <div className="mt-8 p-4 bg-primary/10 rounded-2xl border border-primary/20 text-center">
                  <p className="text-primary font-bold text-sm">Excellent! Knowledge is power.</p>
                </div>
              )}
              {isCorrect === false && (
                <div className="mt-8 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-center">
                  <p className="text-red-500 font-bold text-sm">Not quite. Review the module and try again.</p>
                </div>
              )}
            </div>

            {isCorrect === true ? (
              <button
                onClick={handleNext}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              >
                {activeModule < modules.length - 1 ? 'Next Module' : 'Complete Onboarding'} <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedOption === null}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm disabled:opacity-50"
              >
                Submit Answer
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {portfolio.onboarding_completed && activeModule === modules.length - 1 && isCorrect === true && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="w-24 h-24 bg-accent text-accent-foreground rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Trophy size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Empire Ready!</h1>
          <p className="text-muted-foreground mb-8">You've completed the tutorial and earned your $1,000 bonus capital.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary text-white px-12 py-4 rounded-2xl font-bold text-lg"
          >
            Start Trading
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Learn;
