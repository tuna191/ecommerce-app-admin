import {format} from "date-fns"
import { CategoryClient } from './components/client'
import {CategoriesColumn} from './components/columns'
import prismadb from '@/lib/prismadb'

const CategoriesPage = async ({params}:{params:{storeId:string}}) => {
  
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    include:{
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedCategories : CategoriesColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt,"MMMM do,yyyy")
  }))
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-8 p-8 pt-6'>
            <CategoryClient data={formattedCategories}/>
        </div>
    </div>
  )
}

export default CategoriesPage