import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function GraphScreen({ navigation }) {
  const screenWidth = Dimensions.get("window").width;

  // Dummy data for now — later this will come from Firestore
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [200, 450, 300, 600, 250, 500, 400],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Spending Graph 📈</Text>

      <BarChart
        data={data}
        width={screenWidth - 20}
        height={250}
        yAxisLabel="₱"
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <Text style={styles.note}>
        This is sample data. Real data will appear once Firebase is connected.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, textAlign: "center", marginVertical: 10 },
  chart: { marginVertical: 8, borderRadius: 16 },
  note: { textAlign: "center", color: "gray", marginTop: 10 },
});
