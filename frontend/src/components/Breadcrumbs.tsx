import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
          {item.href && index < items.length - 1 ? (
            <Link to={item.href} className="text-xs text-text-secondary hover:text-text transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={`text-xs ${index === items.length - 1 ? 'text-text font-medium' : 'text-text-secondary'}`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}