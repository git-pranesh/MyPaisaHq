import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import PayCommission from "@/pages/pay-commission";
import GratuityCalc from "@/pages/gratuity";
import SalaryCalc from "@/pages/salary";
import HRACalc from "@/pages/hra";
import HikeCalc from "@/pages/hike";
import IncomeTaxCalc from "@/pages/income-tax";
import SIPCalc from "@/pages/sip";
import LoanVsSIP from "@/pages/loan-vs-sip";
import GoalSIP from "@/pages/goal-sip";
import Brand from "@/pages/brand";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/8th-pay-commission" component={PayCommission} />
        <Route path="/gratuity" component={GratuityCalc} />
        <Route path="/salary" component={SalaryCalc} />
        <Route path="/hra" component={HRACalc} />
        <Route path="/hike" component={HikeCalc} />
        <Route path="/income-tax" component={IncomeTaxCalc} />
        <Route path="/sip" component={SIPCalc} />
        <Route path="/loan-vs-sip" component={LoanVsSIP} />
        <Route path="/goal-sip" component={GoalSIP} />
        <Route path="/brand" component={Brand} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
