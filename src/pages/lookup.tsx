import { Navigate } from "react-router-dom";
import { useAuthContext } from "../store/auth-store";
import Loading from "../components/ui/Loading";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import LookupFormList from "../features/lookup/components/lookup-form-list";
import { MOCK_LOOKUP_FORMS } from "../features/lookup/data/mock-lookup-forms";

// Trang "Tra cứu hồ sơ" phía công dân: danh sách hồ sơ đã nộp + bản nháp đã lưu.
export default function LookupPage() {
  const { isAuthenticated, isInitializing, user } = useAuthContext();

  if (isInitializing) return <Loading show />;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-grey flex flex-col">
      <Header
        userName={user.name}
        activeNav="Tra cứu hồ sơ"
        title="Tra cứu hồ sơ"
        subtitle={
          <p>
            Theo dõi trạng thái các hồ sơ bạn đã nộp và những bản nháp đã lưu.
          </p>
        }
      />

      <main className="w-full max-w-[87.5rem] mx-auto px-10 py-10 pb-12 flex-1">
        <LookupFormList forms={MOCK_LOOKUP_FORMS} />
      </main>

      <Footer />
    </div>
  );
}
