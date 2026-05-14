export function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 18C2 15.2386 5.58172 13 10 13C14.4183 13 18 15.2386 18 18" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="9" width="14" height="10" rx="2" stroke="#707071" strokeWidth="1.5"/>
      <path d="M7 9V6C7 3.79086 8.79086 2 11 2V2C13.2091 2 15 3.79086 15 6V9" stroke="#707071" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14" r="1.5" fill="#707071"/>
    </svg>
  );
}

export function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 10C1 10 4 4 10 4C16 4 19 10 19 10C19 10 16 16 10 16C4 16 1 10 1 10Z" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="10" r="2.5" stroke="#707071" strokeWidth="1.5"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L17 17M8.46 8.46A2.5 2.5 0 0012.54 12.54M6.35 5.35C4.31 6.6 2.7 8.6 2 10c1.5 3.5 5 6 8 6a8.5 8.5 0 004.65-1.35M10 4c3 0 6.5 2.5 8 6a9.5 9.5 0 01-1.65 2.65" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
