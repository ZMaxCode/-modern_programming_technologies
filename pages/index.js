import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export default function Home() {
  return (
    <div>
      <Button icon='pi pi-home' label='hello world' />
      <InputText className='p-mt-2 p-d-block' placeholder='test'/>
    </div>
  )
}
