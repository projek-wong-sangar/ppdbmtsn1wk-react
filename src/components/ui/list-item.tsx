import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

// Ini adalah komponen helper yang digabungkan untuk Link router dan <a> eksternal
const ListItem = React.forwardRef<
  HTMLAnchorElement,
  { to?: string; href?: string; title: string; className?: string; children: React.ReactNode; onClick?: () => void }
>(({ className, title, children, to, href, onClick, ...props }, ref) => {
  
  const content = (
    <div className="flex items-center space-x-2">
      {children} {/* Ini adalah ikon Anda */}
      <span className="text-sm font-medium leading-none">{title}</span>
    </div>
  )

  const itemClassName = cn(
    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
    className
  )

  // Jika memiliki 'to' prop, render sebagai Link router
  if (to) {
    return (
      <li>
        <Link to={to} className={itemClassName} {...props} ref={ref}>
          {content}
        </Link>
      </li>
    )
  }

  // Jika memiliki 'onClick' (seperti Logout)
  if (onClick) {
    return (
      <li>
        <a onClick={onClick} className={cn(itemClassName, "cursor-pointer")} {...props} ref={ref}>
          {content}
        </a>
      </li>
    )
  }

  // Fallback untuk link eksternal biasa
  return (
    <li>
      <a href={href} className={itemClassName} {...props} ref={ref}>
        {content}
      </a>
    </li>
  )
})
ListItem.displayName = "ListItem"

export { ListItem }