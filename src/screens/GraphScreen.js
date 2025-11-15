import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function GraphScreen({ route }) {
  const { expenses = [] } = route.params || {};
  const screenWidth = Dimensions.get("window").width;

  // Calculate total per category
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
    backgroundGradientFrom: "#2A3A4A",
    backgroundGradientTo: "#2A3A4A",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`, // Teal color
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    barRadius: 4,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#3A4A5A",
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "500",
    },
  };

  // Calculate total expenses and category breakdown for the summary
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const categoryBreakdown = categories
    .map((cat, index) => ({
      name: cat,
      amount: totals[index],
      percentage:
        totalExpenses > 0
          ? ((totals[index] / totalExpenses) * 100).toFixed(1)
          : 0,
    }))
    .filter((item) => item.amount > 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Analytics 📊</Text>

      {expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📈</Text>
          <Text style={styles.emptyText}>No expenses data yet</Text>
          <Text style={styles.emptySubtext}>
            Add some expenses to see analytics
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>
                ₱{totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Categories</Text>
              <Text style={styles.summaryValue}>
                {categoryBreakdown.length}
              </Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Spending by Category</Text>
            <BarChart
              data={data}
              width={screenWidth - 48}
              height={250}
              yAxisLabel="₱"
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero={true}
            />
          </View>

          {categoryBreakdown.length > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Category Breakdown</Text>
              {categoryBreakdown.map((category, index) => (
                <View key={index} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryPercentage}>
                      {category.percentage}%
                    </Text>
                  </View>
                  <Text style={styles.categoryAmount}>
                    ₱{category.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2A3A",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 24,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#B8C5D6",
    textAlign: "center",
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: "#2A3A4A",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#B8C5D6",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4ECDC4",
  },
  chartCard: {
    backgroundColor: "#2A3A4A",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  breakdownCard: {
    backgroundColor: "#2A3A4A",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3A4A5A",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    marginRight: 12,
  },
  categoryPercentage: {
    fontSize: 14,
    color: "#4ECDC4",
    fontWeight: "600",
    backgroundColor: "#3A4A5A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4ECDC4",
  },
});
