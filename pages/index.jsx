import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import View from '../components/view';

export default function Home() {

  const [activePanel, setActivePanel] = useState('page1')
  
  return (
    <div>
      <View activePanel={activePanel}>
        <div id='page1'>page 1</div>
        <div id='page2'>page 2</div>
      </View>

      <Button label='change' onClick={() => setActivePanel('page2')} />
    </div>
  )
}
