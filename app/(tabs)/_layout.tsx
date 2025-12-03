import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"      // MainScreen route
        options={{ title: "Main" }}
      />
      <Tabs.Screen
        name="about"      // AboutScreen route
        options={{ title: "About" }}
      />
    </Tabs>
  );
}
