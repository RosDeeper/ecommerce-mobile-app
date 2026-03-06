import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/Header";

const Home = () => {
  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Header title="Forever" showCart showLogo showMenu />
    </SafeAreaView>
  );
};

export default Home;
