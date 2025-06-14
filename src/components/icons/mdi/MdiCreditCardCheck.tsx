import type { SVGProps } from 'react'

export function MdiCreditCardCheck(props: SVGProps<SVGSVGElement>) {
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
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9.09c-.06-.33-.09-.66-.09-1c0-3.31 2.69-6 6-6c1.06 0 2.09.28 3 .81V6c0-1.11-.89-2-2-2m0 7H4V8h16m-2.25 14L15 19l1.16-1.16l1.59 1.59l3.59-3.59l1.16 1.41z"
      />
    </svg>
  )
}
export default MdiCreditCardCheck
