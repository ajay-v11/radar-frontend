'use client';

interface ExportButtonProps {
  type: 'pdf' | 'csv' | 'json' | 'table';
  title: string;
  description: string;
  color: 'red' | 'green' | 'blue' | 'purple';
  onClick: () => void;
}

const colorClasses = {
  red: 'bg-red-500/10 text-red-500',
  green: 'bg-green-500/10 text-green-500',
  blue: 'bg-blue-500/10 text-blue-500',
  purple: 'bg-purple-500/10 text-purple-500',
};

const icons = {
  pdf: (
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    />
  ),
  csv: (
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    />
  ),
  json: (
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    />
  ),
  table: (
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    />
  ),
};

export function ExportButton({
  type,
  title,
  description,
  color,
  onClick,
}: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className='group rounded-lg border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5'>
      <div className='mb-3 flex items-center justify-between'>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[color]}`}>
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            {icons[type]}
          </svg>
        </div>
        {type === 'table' ? (
          <svg
            className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 7l5 5m0 0l-5 5m5-5H6'
            />
          </svg>
        ) : (
          <svg
            className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
            />
          </svg>
        )}
      </div>
      <h4 className='mb-1 font-semibold text-foreground'>{title}</h4>
      <p className='text-xs text-muted-foreground'>{description}</p>
    </button>
  );
}
