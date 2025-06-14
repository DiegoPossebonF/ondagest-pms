import type { SVGProps } from 'react'

export function MdiCreditCardClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
      <path
        fill="currentColor"
        d="M16 14h1.5v2.82l2.44 1.41l-.75 1.3L16 17.69zm8 3a7 7 0 0 1-7 7c-2.79 0-5.2-1.64-6.33-4H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h16a2 2 0 0 1 2 2v6.1c1.24 1.26 2 2.99 2 4.9m-7-5a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m3-2V7H4v3z"
      />
    </svg>
  )
}
export default MdiCreditCardClock
