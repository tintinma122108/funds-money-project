'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Button, Card, CardContent, Input, Tag, Modal } from '@/components/ui';
import { Header, Container } from '@/components/layout';
import { useGame } from '@/contexts/GameContext';

export default function PlayPage() {
  const router = useRouter();
  const { state, actions } = useGame();
  const [question, setQuestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.qaList]);

  // 如果没有当前题目，重定向到开始页
  useEffect(() => {
    if (!state.currentPuzzle && !state.isLoading) {
      router.push('/start');
    }
  }, [state.currentPuzzle, state.isLoading, router]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || state.isLoading) return;

    const questionText = question.trim();
    setQuestion('');
    await actions.askQuestion(questionText);
  };

  const handleEndGame = () => {
    actions.endGame();
  };

  const handleRevealSolution = () => {
    actions.revealSolution();
    router.push('/reveal');
  };

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case 'YES': return 'success';
      case 'NO': return 'error';
      case 'BOTH': return 'warning';
      case 'IRRELEVANT': return 'info';
      default: return 'info';
    }
  };

  const getAnswerText = (answer: string) => {
    switch (answer) {
      case 'YES': return '是';
      case 'NO': return '不是';
      case 'BOTH': return '是又不是';
      case 'IRRELEVANT': return '不重要';
      default: return '未知';
    }
  };

  if (!state.currentPuzzle) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Header 
        title={state.currentPuzzle.title}
        showChangeButton={true}
        onBack={() => router.push('/start')}
      />

      <Container className="py-6">
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* 题目卡片 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <p className="text-body text-text-primary leading-relaxed">
                {state.currentPuzzle.prompt}
              </p>
            </CardContent>
          </Card>

          {/* 问答列表 */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {state.qaList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-body text-text-secondary">
                  开始提问吧！我会回答"是"、"不是"、"不重要"或"是又不是"
                </p>
              </div>
            ) : (
              state.qaList.map((qa) => (
                <div key={qa.id} className="space-y-2">
                  {/* 用户问题 */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-fuschia-100 text-white p-3 rounded-default rounded-br-small">
                      <p className="text-body">{qa.question}</p>
                    </div>
                  </div>
                  
                  {/* 系统回答 */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-background-secondary p-3 rounded-default rounded-bl-small border border-gray-800">
                      <div className="flex items-center gap-2">
                        <Tag variant={getAnswerColor(qa.answer) as any} size="sm">
                          {getAnswerText(qa.answer)}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* 加载状态 */}
            {state.isLoading && (
              <div className="flex justify-start">
                <div className="bg-background-secondary p-3 rounded-default border border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fuschia-100"></div>
                    <p className="text-body text-text-secondary">思考中...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <Card variant="glass" className="sticky bottom-0">
            <CardContent className="p-4">
              <form onSubmit={handleSubmitQuestion} className="flex gap-3">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="输入你的问题..."
                  disabled={state.isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!question.trim() || state.isLoading}
                >
                  发送
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleEndGame}
                  disabled={state.isLoading}
                >
                  结束
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* 揭晓模态框 */}
      <Modal
        isOpen={state.showRevealModal}
        onClose={() => actions.dispatch({ type: 'SET_REVEAL_MODAL', payload: false })}
        title="揭晓答案"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-h2 mb-3">完整故事</h3>
            <p className="text-body text-text-secondary leading-relaxed">
              {state.currentPuzzle?.solution}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleRevealSolution} className="flex-1">
              重新开始
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => actions.dispatch({ type: 'SET_REVEAL_MODAL', payload: false })}
              className="flex-1"
            >
              继续推理
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
