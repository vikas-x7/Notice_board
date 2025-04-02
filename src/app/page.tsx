/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserHomeRoute } from "@/lib/user-home";
import { MdDashboard } from "react-icons/md";
import MarqueeSection from "@/client/home/MarqueeSection";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getUserHomeRoute(user.role));
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="fixed z-30 w-full">
        <MarqueeSection />
        <div className="w-full flex items-center justify-center bg-[#171615]">
          <header className="w-full max-w-7xl px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-[17px] md:text-[26px] flex items-center gap-3 font-serif font-medium -tracking-[0.5px] hover:opacity-80 transition text-white"
              >
                <MdDashboard size={27} />
                Notice board
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="bg-[#1E1D1C] text-white px-4 py-1.5 text-[15px] transition hover:bg-black/80 rounded-[30px]"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-white border border-black/10 text-black px-4 py-1.5 text-[15px] rounded-[30px] hover:bg-gray-100 transition"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </header>
        </div>
      </div>

      <section className="relative min-h-screen flex-1 mt-20 items-center justify-center pt-20">
        <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
          <div className="relative flex items-center justify-center ">
            <div className="relative z-10 flex flex-col items-center text-center w-5xl  px-4 ">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] -tracking-[1px] sm:-tracking-[2px] md:-tracking-[3px] font-serif font-medium text-[#D6D5D4]">
                One Platform to Create, Manage, and <br /> Deliver AllYour
                Important Notices
              </h1>

              <p className="text-sm md:text-lg lg:text-[19px]  text-[#8C8B8A] mt-6">
                Designed for schools, colleges, and organizations to simplify{" "}
                <br /> communication and announcements.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <Link
                  href="/login"
                  className="bg-[#D6D5D4] text-[#000000] px-6 py-2 text-[15px] font-medium rounded-[33px] transition hover:bg-gray-100 hover:shadow-lg"
                >
                  Get started now
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-20 px-2 sm:px-4 md:px-6 mt-20">
          <img
            src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1774940649/Screenshot_from_2026-03-31_12-33-00_oaruhi.png"
            alt="App preview"
            className="w-7xl h-auto "
          />
        </div>
      </section>
    </main>
  );
}
