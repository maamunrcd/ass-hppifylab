'use client';

import Link from 'next/link';
import { Search, Bell, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { logout, logoutPending } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom py-2">
      <div className="container">
        <Link href="/feed" className="navbar-brand d-flex align-items-center">
          <img src="/assets/images/logo.png" alt="Logo" height="32" className="me-2" />
          <span className="fw-bold text-primary">AppifySocial</span>
        </Link>
        
        <div className="navbar-search flex-grow-1 mx-4 d-none d-md-block">
          <div className="position-relative">
            <Search className="position-absolute translate-middle-y top-50 ms-3 text-muted" size={18} />
            <input 
              type="text" 
              className="form-control ps-5 bg-light border-0 py-2 rounded-pill" 
              placeholder="Search posts, people..." 
            />
          </div>
        </div>

        <div className="navbar-nav d-flex flex-row align-items-center gap-3">
          <Link href="/feed" className="nav-link p-2 bg-light rounded-circle text-muted">
            <Bell size={20} />
          </Link>
          <Link href="/feed" className="nav-link p-2 bg-light rounded-circle text-muted">
            <Mail size={20} />
          </Link>
          <div className="dropdown">
            <button className="btn p-0 border-0 dropdown-toggle no-caret" data-bs-toggle="dropdown">
              <div className="avatar">
                <img src="/assets/images/user-placeholder.png" alt="User" className="rounded-circle" width="32" height="32" />
              </div>
            </button>
            {/* Simple logout for now */}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-3"
              disabled={logoutPending}
              onClick={logout}
            >
              {logoutPending ? '…' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
