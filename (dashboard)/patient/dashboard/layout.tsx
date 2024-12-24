
import { Header } from "@/components/patient/Header";
import Sidebar from "@/components/patient/Sidebar";
interface DashboardLayoutProps {
  children: React.ReactNode;  
}

const PatientDashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="flex h-screen ">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Header />
        <main className="remove-scrollbar h-full flex-1 overflow-auto px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10 !important;">
          {children}
        </main>
      </div>
    </main>
  );
}

export default PatientDashboardLayout;
