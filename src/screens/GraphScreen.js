import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function GraphScreen({ route }) {
  const { expenses = [] } = route.params || {}; // 🆕 Get expenses from route params
  const screenWidth = Dimensions.get("window").width;

  // 🧮 Calculate total per category
  const categories = ["Food", "Transport", "Bills", "Shopping", "Others"];
  const totals = categories.map((cat) =>
    expenses
      .filter((item) => item.category === cat)
      .reduce((sum, item) => sum + item.amount, 0)
  );

  // Prepare data for chart
  const data = {
    labels: categories,
    datasets: [{ data: totals }],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Summary 📊</Text>

      {expenses.length === 0 ? (
        <Text style={styles.note}>No expenses yet. Add some first.</Text>
      ) : (
        <BarChart
          data={data}
          width={screenWidth - 20}
          height={250}
          yAxisLabel="₱"
          chartConfig={chartConfig}
          style={styles.chart}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, textAlign: "center", marginVertical: 10 },
  chart: { marginVertical: 8, borderRadius: 16 },
  note: { textAlign: "center", color: "gray", marginTop: 20 },
});
