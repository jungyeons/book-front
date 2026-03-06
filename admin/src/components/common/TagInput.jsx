import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
export function TagInput({ value, onChange, placeholder = '태그 입력 후 Enter' }) {
    const [input, setInput] = useState('');
    const addTag = () => {
        const tag = input.trim();
        if (tag && !value.includes(tag)) {
            onChange([...value, tag]);
        }
        setInput('');
    };
    return (<div className="space-y-2">
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
    } }} placeholder={placeholder}/>
      </div>
      {value.length > 0 && (<div className="flex flex-wrap gap-1">
          {value.map(tag => (<Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} aria-label={`${tag} 삭제`}>
                <X className="h-3 w-3"/>
              </button>
            </Badge>))}
        </div>)}
    </div>);
}
