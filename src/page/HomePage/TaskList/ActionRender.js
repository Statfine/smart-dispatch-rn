import React from 'react';
import HiButton from '../../../components/HiButton';

const actionTypeStyleMap = {
  primary: { backgroundColor: '#1890FF' },
  danger: { backgroundColor: '#FF4D4F' }
  // primary: { backgroundColor: '#1890FF' },
  // primary: { backgroundColor: '#1890FF' },
};
export default function ActionRender ({ taskId, actions, onPress }: any) {
  return (
    <>
      {
        actions.map(action => (
          <HiButton
            buttonStyle={actionTypeStyleMap[action.get('actionType').toLowerCase()]}
            onPress={() => onPress(action)}
            disabled={action.get('disable')}
            key={taskId + action.get('actionKey')} text={action.get('actionText')}/>
        ))
      }
    </>
  );
}
