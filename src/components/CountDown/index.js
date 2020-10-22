import React, { memo, useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

function CountDown ({ targetTime }) {
  const [text, setText] = useState('');
  const [isDelay, setIsDelay] = useState(false);

  const timerRef = useRef();
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const nowTime = Date.now();
      const readDiff = parseInt((targetTime - nowTime) / 1000);
      const difference = Math.abs(readDiff);
      const hour = String(parseInt(difference / 3600)).padStart(2, '0');
      const minute = String(parseInt(difference % 3600 / 60)).padStart(2, '0');
      const second = String(parseInt(difference % 60)).padStart(2, '0');
      setIsDelay(readDiff < 0);
      setText(`${hour}:${minute}:${second}`);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [setText]);
  if (!text) {
    return null;
  }
  return (
    <>
      <Text style={[styles.countDownText, isDelay ? styles.delayColor : null]}>{isDelay ? '已超时:' : '剩余时间:'}{text}</Text>
    </>
  );
}

export default memo(CountDown);

const styles = StyleSheet.create({
  countDownText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#414141',
  },
  delayColor: {
    color: 'rgba(255, 94, 55, 1)'
  }
});
