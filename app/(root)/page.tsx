import Image from "next/image";



const Dashboard = async Promise.all([
  const [files, totalSpace] = await Promise.all([
    getFiles({types: [], limit: 10}),
    getTotalSpaceUsed(),
])

export default function Home() {
  return (
    <div className={"flex-center h-screen"}>
      <h1 className="h1">CloneIt, Store your file and share easily.</h1>
    </div>
  );
}
