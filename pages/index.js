import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session}= useSession();
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      {session ? (
        <>
          <h2>
            Hello, <b>{session.user.name}</b>
          </h2>
          <div className="flex bg-gray-400 gap-1 text-black rounded-lg overflow-hidden">
            <img src={session.user.image} alt="" className="w-8 h-8"/>
            <span className="py-1 px-2">
              {session.user.name}
            </span>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  </Layout>
}
