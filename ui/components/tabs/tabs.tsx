export type Tab = 'icons' | 'config' | 'github'

interface TabsProps {
  current: Tab
  onSelect: (tab: Tab) => void
}

export default function Tabs(props: TabsProps) {
  const base = 'just flex flex-1 flex-col items-center justify-end gap-1'
  const active = 'text-[#101518]'
  const inactive = 'text-[#5c748a]'

  return (
    <div className="fixed bottom-0 left-0 w-full flex gap-2 border-t border-[#eaedf1] bg-gray-50 px-4 pb-3 pt-2">
      <button
        className={`${base} ${props.current === 'icons' ? active : inactive}`}
        onClick={() => props.onSelect('icons')}
      >
        <div className={`flex h-8 items-center justify-center ${props.current === 'icons' ? active : inactive}`}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z" />
          </svg>
        </div>
        <p className="text-xs font-medium leading-normal tracking-[0.015em]">Icons</p>
      </button>
      <button
        className={`${base} ${props.current === 'config' ? active : inactive}`}
        onClick={() => props.onSelect('config')}
      >
        <div className={`flex h-8 items-center justify-center ${props.current === 'config' ? active : inactive}`}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" />
          </svg>
        </div>
        <p className="text-xs font-medium leading-normal tracking-[0.015em]">Settings</p>
      </button>
      <button
        className={`${base} ${props.current === 'github' ? active : inactive}`}
        onClick={() => props.onSelect('github')}
      >
        <div className={`flex h-8 items-center justify-center ${props.current === 'github' ? active : inactive}`}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128 24A104 104 0 0024 128c0 46 29.67 85.19 70.84 98.89 5.18.96 7.08-2.25 7.08-5v-17.6c-28.82 6.29-34.93-13.86-34.93-13.86-4.72-12-11.55-15.21-11.55-15.21-9.45-6.47.72-6.34.72-6.34 10.45.74 15.94 10.72 15.94 10.72 9.29 15.91 24.38 11.32 30.34 8.66a22.28 22.28 0 016.63-13.9c-23-2.61-47.19-11.49-47.19-51.19 0-11.31 4-20.56 10.63-27.78-1.07-2.6-4.62-13.11 1-27.33 0 0 8.71-2.79 28.55 10.64a98.75 98.75 0 0152 0c19.84-13.43 28.54-10.64 28.54-10.64 5.63 14.22 2.09 24.73 1 27.33 6.62 7.22 10.62 16.47 10.62 27.78 0 39.86-24.23 48.54-47.32 51.11a24.87 24.87 0 017.13 19.26v28.57c0 2.77 1.88 5.94 7.12 5A104 104 0 00128 24z" />
          </svg>
        </div>
        <p className="text-xs font-medium leading-normal tracking-[0.015em]">GitHub</p>
      </button>
    </div>
  )
}
