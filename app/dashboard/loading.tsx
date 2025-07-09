import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, BarChart3, History } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="border-0 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                {i === 0 && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                {i === 1 && <BarChart3 className="h-4 w-4 text-muted-foreground" />}
                {i === 2 && <History className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scraping Form Skeleton */}
        <div className="mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-64" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <Card key={i} className="border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-40" />
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
