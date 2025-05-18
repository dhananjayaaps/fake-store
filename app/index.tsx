import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function Index() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth"); // redirect to auth
    } else {
      router.replace("/(tabs)"); // or home/dashboard
    }
  }, [isAuthenticated]);

  return null; // or a loading spinner
}
