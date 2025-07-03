import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type ButtonTooltipProps = {
  children?: React.ReactNode
  icon?: React.ReactElement
  className?: string
  tooltipText: string
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  onClick: () => void
}

export const ButtonTooltip = ({
  children,
  icon,
  tooltipText,
  tooltipSide = 'right',
  className,
  onClick,
}: ButtonTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            size={'icon'}
            className={className}
            onClick={onClick}
          >
            {icon && icon}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltipText}</TooltipContent>
    </Tooltip>
  )
}
