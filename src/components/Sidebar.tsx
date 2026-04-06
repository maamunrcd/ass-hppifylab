'use client';

import Link from 'next/link';
import { Home, Compass, Bell, User, Settings, Shield } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar position-sticky top-100 mt-4 h-full">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-body p-0">
          <div className="profile-hero bg-primary bg-gradient py-4 text-center">
            <div className="avatar avatar-lg mx-auto mb-2 border border-4 border-white rounded-circle overflow-hidden shadow-sm">
              <img src="/assets/images/user-placeholder.png" alt="User" className="w-100" />
            </div>
          </div>
          <div className="p-3 text-center">
            <h6 className="fw-bold mb-1">User Name</h6>
            <p className="small text-muted mb-3">@username</p>
            <div className="d-flex justify-content-center gap-3 border-top pt-3">
              <div className="text-center">
                <p className="small fw-bold mb-0">12k</p>
                <p className="tiny text-muted mb-0">Followers</p>
              </div>
              <div className="text-center">
                <p className="small fw-bold mb-0">850</p>
                <p className="tiny text-muted mb-0">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-2">
        <ul className="nav flex-column gap-1">
          <li className="nav-item">
            <Link href="/feed" className="nav-link active d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-primary bg-primary bg-opacity-10">
              <Home size={20} />
              <span className="fw-semibold">Feed</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/feed" className="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-muted">
              <Compass size={20} />
              <span className="fw-semibold">Explore</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/feed" className="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-muted">
              <Bell size={20} />
              <span className="fw-semibold">Notifications</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/feed" className="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-muted">
              <User size={20} />
              <span className="fw-semibold">Profile</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/feed" className="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-muted">
              <Settings size={20} />
              <span className="fw-semibold">Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
