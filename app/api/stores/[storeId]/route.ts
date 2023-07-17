import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { log } from "console";


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// mặc dù tham số req ko đc dùng nhưng cx không được bỏ bởi vì tham số params chỉ hoạt động khi là tham số 2
export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();

        if (!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }


        if(!params.storeId){
            return new NextResponse("StoreId is required",{status:400});
        }

        const store = await prismadb.store.deleteMany({
            where:{
                id: params.storeId,
                userId
            },
            
        })

        return NextResponse.json(store)
    } catch (error) {
        console.log('[STORE_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
