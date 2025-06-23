import { useEffect } from 'react';

export default function Alert({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-4 w-full max-w-[400] left-1/2 -translate-x-1/2 flex items-center p-4 text-gray-700 border-t-4 border-green-900 bg-green-50 rounded"
      role="alert"
    >
      <div className="text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex items-center justify-center h-8 w-8"
        data-dismiss-target="#alert-1"
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}
