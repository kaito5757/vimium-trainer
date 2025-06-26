'use client';

import { useEffect, useState, useCallback } from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  pressedKeys: string[];
  allowedKeys?: string[];
}

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift-L', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift-R'],
  ['Ctrl-L', 'Alt-L', 'Space', 'Alt-R', 'Ctrl-R']
];

const specialKeyWidths: { [key: string]: string } = {
  'Tab': 'w-16',
  'Caps': 'w-20',
  'Enter': 'w-20',
  'Shift-L': 'w-24',
  'Shift-R': 'w-24',
  'Space': 'w-64',
  'Ctrl-L': 'w-16',
  'Ctrl-R': 'w-16',
  'Alt-L': 'w-16',
  'Alt-R': 'w-16',
};

export function VirtualKeyboard({ onKeyPress, pressedKeys, allowedKeys }: VirtualKeyboardProps) {
  const [modifiers, setModifiers] = useState({
    shift: false,
    ctrl: false,
    alt: false,
  });

  // 許可されたキーかどうかをチェック
  const isKeyAllowed = useCallback((key: string): boolean => {
    if (!allowedKeys || allowedKeys.length === 0) return true;
    
    // 現在の入力と許可されたキーを比較
    const currentInput = pressedKeys.join('') + key;
    return allowedKeys.some(allowed => allowed.startsWith(currentInput));
  }, [allowedKeys, pressedKeys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      // モディファイアキーの状態を更新
      if (e.key === 'Shift') setModifiers(prev => ({ ...prev, shift: true }));
      if (e.key === 'Control') setModifiers(prev => ({ ...prev, ctrl: true }));
      if (e.key === 'Alt') setModifiers(prev => ({ ...prev, alt: true }));
      
      // キーの組み合わせを構築
      let keyCombo = '';
      if (e.ctrlKey && e.key !== 'Control') keyCombo += 'ctrl+';
      if (e.altKey && e.key !== 'Alt') keyCombo += '<a-';
      if (e.shiftKey && e.key !== 'Shift' && e.key.length === 1) {
        keyCombo += e.key.toUpperCase();
      } else if (e.key.length === 1) {
        keyCombo += e.key.toLowerCase();
      } else if (!['Shift', 'Control', 'Alt'].includes(e.key)) {
        keyCombo += e.key;
      }
      
      if (e.altKey && e.key !== 'Alt') keyCombo += '>';
      
      // 許可されたキーのみ処理
      if (keyCombo && isKeyAllowed(keyCombo)) {
        onKeyPress(keyCombo);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setModifiers(prev => ({ ...prev, shift: false }));
      if (e.key === 'Control') setModifiers(prev => ({ ...prev, ctrl: false }));
      if (e.key === 'Alt') setModifiers(prev => ({ ...prev, alt: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPress, isKeyAllowed]);

  const isKeyPressed = (key: string) => {
    const lowerKey = key.toLowerCase();
    
    // モディファイアキーのチェック
    if (lowerKey.startsWith('shift')) return modifiers.shift;
    if (lowerKey.startsWith('ctrl')) return modifiers.ctrl;
    if (lowerKey.startsWith('alt')) return modifiers.alt;
    
    // 押されたキーのチェック
    return pressedKeys.some(pressed => {
      if (pressed === lowerKey) return true;
      if (pressed === key) return true;
      if (modifiers.shift && pressed === key.toUpperCase()) return true;
      return false;
    });
  };

  const isKeyInOptions = (key: string): boolean => {
    if (!allowedKeys) return true;
    const lowerKey = key.toLowerCase();
    const cleanKey = key.replace(/-[LR]$/, ''); // Remove -L/-R suffix
    
    return allowedKeys.some(allowed => 
      allowed.toLowerCase().includes(lowerKey) || 
      allowed.toLowerCase().includes(cleanKey.toLowerCase()) ||
      (cleanKey === 'Shift' && allowed.match(/[A-Z]/)) ||
      (cleanKey === 'Alt' && allowed.includes('<a-')) ||
      (cleanKey === 'Ctrl' && allowed.includes('ctrl+'))
    );
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {row.map((key) => (
              <button
                key={key}
                className={`
                  ${specialKeyWidths[key] || 'w-12'} 
                  h-12 
                  ${isKeyPressed(key) ? 'bg-blue-500 text-white' : 
                    isKeyInOptions(key) ? 'bg-white text-gray-700' : 'bg-gray-200 text-gray-400'}
                  border ${isKeyInOptions(key) ? 'border-gray-300' : 'border-gray-200'} 
                  rounded-md font-mono text-sm
                  transition-colors duration-150
                  ${!isKeyInOptions(key) ? 'cursor-not-allowed' : ''}
                `}
                disabled
              >
                {key === 'Space' ? '' : key.replace(/-[LR]$/, '')}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          押されたキー: <span className="font-mono text-lg font-bold text-blue-600">
            {pressedKeys.join('')}
          </span>
        </p>
      </div>
    </div>
  );
}