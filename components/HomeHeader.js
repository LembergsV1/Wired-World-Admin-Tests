import { useSession } from "next-auth/react";

export default function HomeHeader(){
    const{data: session} = useSession();
    return(
        <div className="text-blue-900 flex justify-between">
      {session ? (
        <>
          <h2 className="mt-0">
            <div className="flex gap-3 items-center">
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-md sm:hidden"/>
                <div>
                    Sveicināti, <b>{session.user.name}</b>
                </div>
            </div>
          </h2>
          <div className="hidden sm:block">
            <div className="bg-red-200 flex gap-1 text-black rounded-lg overflow-hidden">
            <img src={session.user.image} alt="" className="w-8 h-8"/>
            <span className="py-1 px-2">
              {session.user.name}
            </span>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    );
}