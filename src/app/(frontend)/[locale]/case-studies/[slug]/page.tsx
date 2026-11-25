import { detailRoute } from '@/components/detail'
const route = detailRoute('case-studies')
export const dynamic = 'force-dynamic'
export const generateMetadata = route.generateMetadata
export default route.Page
