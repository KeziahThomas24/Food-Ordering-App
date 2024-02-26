import Link from "next/link";
import { usePathname } from "next/navigation";

type UserTabsProps = {
  isAdmin: boolean;
};

const UserTabs: React.FC<UserTabsProps> = ({ isAdmin }) => {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link href="/profile" passHref>
        <span className={path === '/profile' ? 'active' : ''}>Profile</span>
      </Link>
      {isAdmin && (
        <>
          <Link href="/categories" passHref>
            <span className={path === '/categories' ? 'active' : ''}>Categories</span>
          </Link>
          <Link href="/menu-items" passHref>
            <span className={path.includes('menu-items') ? 'active' : ''}>Menu Items</span>
          </Link>
          <Link href="/users" passHref>
            <span className={path.includes('/users') ? 'active' : ''}>Users</span>
          </Link>
        </>
      )}
      <Link href="/orders" passHref>
        <span className={path === '/orders' ? 'active' : ''}>Orders</span>
      </Link>
    </div>
  );
};

export default UserTabs;
