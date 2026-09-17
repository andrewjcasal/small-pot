import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './BackLink.css';

/** The "back" link every inner page carries in its top-left corner. */
export default function BackLink({ to = '/links' }: { to?: string }) {
  return (
    <Link to={to} className="page-back">
      <ArrowLeft className="page-back-icon" aria-hidden="true" />
      <span>back</span>
    </Link>
  );
}
