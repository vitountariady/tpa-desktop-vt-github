import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { getAuth } from 'firebase/auth';
import { Link,useNavigate } from 'react-router-dom';
import { BellIcon as BellIconSolid} from '@heroicons/react/solid';
import { BellIcon as BellIconOutline } from '@heroicons/react/outline';
import { doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase.config';
import { UserAuth } from '../context/AuthContext';
import NotificationsWindow from './notifications';

const navigation = [
  { name: 'Home', href: '/home', current: false },
  { name: 'Closed Boards', href: '/closedboards', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const auth = getAuth();
  const navigate= useNavigate();
  const [InviteNotifications, setInviteNotifications] = useState([]);
  const [BoardInviteNotifications, setBoardInviteNotifications] = useState([]);
  const [DeleteNotifications, setDeleteNotifications] = useState([]);
  const [BoardDeleteNotifications, setBoardDeleteNotifications] = useState([]);
  const [MessageNotifications, setMessageNotifications] = useState([]);
  const [Notif, setNotif] = useState(false);
  const [ShowNotifications, setShowNotifications] = useState(false);
  const loggedIn = UserAuth();
  

  useEffect(() => {
    if(loggedIn.user.uid === undefined){
      return;
    }
    const q= query(doc(db,'notifications',loggedIn.user.uid));
    onSnapshot(q,(document)=>{
      if(document.data()===undefined){
        return;
      }
      console.log(document.data())
      if(document.data().delete.length > 0 || document.data().invite.length > 0 || document.data().message.length > 0 ||document.data().boarddelete.length>0 || document.data().boardinvite.length>0){
        setDeleteNotifications(document.data().delete);
        setBoardDeleteNotifications(document.data().boarddelete);
        setInviteNotifications(document.data().invite);
        setBoardInviteNotifications(document.data().boardinvite);
        setMessageNotifications(document.data().message);
        setNotif(true);
      }else{
        setNotif(false);
        setShowNotifications(false);
      }
    })
  }, [loggedIn])
  

  function logout(){
    auth.signOut();
    navigate("/");
}

  const toggleNotifModal=()=>{
    setShowNotifications(!ShowNotifications);
  }


  return (
    <Disclosure as="nav" className=" bg-gray-800 w-full absolute top-0">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <p className="text-3xl text-white">CHello</p>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {Notif && (
                <BellIconSolid onClick={toggleNotifModal} className="fill-white w-6"></BellIconSolid>
              )}
              {!Notif && (
                <BellIconOutline className="stroke-white w-6"></BellIconOutline>
              )}
              {ShowNotifications && (
                <NotificationsWindow toggle = {toggleNotifModal} inviteNotifications={InviteNotifications} boardInviteNotifications={BoardInviteNotifications} deleteNotifications ={DeleteNotifications} boardDeleteNotifications={BoardDeleteNotifications} messageNotifications={MessageNotifications}></NotificationsWindow>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={loggedIn.userData.profilePicture}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link to={'/setting'}>
                            <p
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Settings
                            </p>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <p
                          onClick={logout}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </p>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}