
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart, Calendar, Clock, ArrowUpRight, ArrowDownRight, DollarSign, Users } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock data for demonstration purposes
const monthlyData = [
  { name: "Jan", value: 3200 },
  { name: "Feb", value: 4500 },
  { name: "Mar", value: 3800 },
  { name: "Apr", value: 5100 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 6000 },
  { name: "Jul", value: 5500 },
  { name: "Aug", value: 7200 },
  { name: "Sep", value: 8100 },
  { name: "Oct", value: 7500 },
  { name: "Nov", value: 8800 },
  { name: "Dec", value: 9500 },
];

const categoryData = [
  { name: "Knives", value: 35 },
  { name: "Gloves", value: 25 },
  { name: "Rifles", value: 20 },
  { name: "Pistols", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ["#8F54F0", "#4CC3FF", "#F062C0", "#50E3C2", "#E8C547"];

const recentTransactions = [
  { id: 1, item: "AWP | Asiimov", price: 120.50, change: 5.2, type: "sale" },
  { id: 2, item: "Butterfly Knife | Fade", price: 890.75, change: -2.1, type: "purchase" },
  { id: 3, item: "AK-47 | Vulcan", price: 76.20, change: 1.8, type: "sale" },
  { id: 4, item: "M4A4 | Howl", price: 1250.00, change: 12.5, type: "sale" },
  { id: 5, item: "Gloves | Crimson Kimono", price: 435.90, change: -3.4, type: "purchase" },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen bg-gradient-radial">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">Track your skin investments and market performance</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search analytics..."
                  className="w-full md:w-[300px] bg-background/60 border-border/50"
                />
              </div>
              
              <Button className="neon-button">
                <Calendar className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Portfolio Value"
              value="$12,568.90"
              change={+12.5}
              icon={<DollarSign />}
            />
            <StatCard
              title="Market Volume (24h)"
              value="$1.24M"
              change={-2.3}
              icon={<BarChart3 />}
            />
            <StatCard
              title="Profitable Items"
              value="78%"
              change={+4.7}
              icon={<TrendingUp />}
            />
            <StatCard
              title="Active Traders"
              value="2,485"
              change={+15.2}
              icon={<Users />}
            />
          </div>
          
          {/* Main Content Tabs */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="market">Market Trends</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="glass-card col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Portfolio Value Over Time
                    </CardTitle>
                    <CardDescription>
                      Your total portfolio value over the last 12 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={monthlyData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8F54F0" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8F54F0" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="name" 
                            stroke="#888888"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#888888"
                            fontSize={12}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <Tooltip 
                            formatter={(value) => [`$${value}`, "Value"]}
                            contentStyle={{ 
                              backgroundColor: "#1e1e2d", 
                              borderColor: "#2a2a3a",
                              color: "#fff" 
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8F54F0"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center">
                      <PieChart className="mr-2 h-5 w-5" />
                      Portfolio Distribution
                    </CardTitle>
                    <CardDescription>
                      Category breakdown of your skin collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                            contentStyle={{ 
                              backgroundColor: "#1e1e2d", 
                              borderColor: "#2a2a3a",
                              color: "#fff" 
                            }}
                          />
                        </RPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>
                    Your most recent buy and sell activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/40">
                          <th className="text-left pb-3 font-medium text-muted-foreground">Item</th>
                          <th className="text-right pb-3 font-medium text-muted-foreground">Price</th>
                          <th className="text-right pb-3 font-medium text-muted-foreground">Change</th>
                          <th className="text-right pb-3 font-medium text-muted-foreground">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((transaction) => (
                          <tr 
                            key={transaction.id} 
                            className="border-b border-border/20 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3">{transaction.item}</td>
                            <td className="py-3 text-right">${transaction.price.toFixed(2)}</td>
                            <td className="py-3 text-right">
                              <span className={`flex items-center justify-end ${transaction.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {transaction.change > 0 ? (
                                  <ArrowUpRight className="mr-1 h-4 w-4" />
                                ) : (
                                  <ArrowDownRight className="mr-1 h-4 w-4" />
                                )}
                                {Math.abs(transaction.change)}%
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                transaction.type === 'sale' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}>
                                {transaction.type === 'sale' ? 'Sold' : 'Bought'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="portfolio" className="space-y-6">
              <Card className="glass-card p-8 text-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Portfolio Analytics Coming Soon</h3>
                  <p className="text-muted-foreground max-w-[500px] mx-auto">
                    We're working hard to bring you detailed portfolio analytics, including historical performance, 
                    profit/loss tracking, and personalized investment recommendations.
                  </p>
                  <Button className="neon-button mt-4">
                    Get Notified When Available
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="market" className="space-y-6">
              <Card className="glass-card p-8 text-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Market Analytics Coming Soon</h3>
                  <p className="text-muted-foreground max-w-[500px] mx-auto">
                    Soon you'll be able to analyze market trends, price fluctuations, and volume data 
                    to make informed trading decisions on our platform.
                  </p>
                  <Button className="neon-button mt-4">
                    Get Notified When Available
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="predictions" className="space-y-6">
              <Card className="glass-card p-8 text-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">AI Price Predictions Coming Soon</h3>
                  <p className="text-muted-foreground max-w-[500px] mx-auto">
                    Our advanced AI algorithms will soon help you predict future price movements
                    and market trends to maximize your investment returns.
                  </p>
                  <Button className="neon-button mt-4">
                    Get Notified When Available
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon 
}: { 
  title: string; 
  value: string; 
  change: number; 
  icon: React.ReactNode;
}) => {
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
            
            <div className={`flex items-center mt-2 text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              <span>{Math.abs(change)}% since last month</span>
            </div>
          </div>
          
          <div className="p-2 bg-white/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
