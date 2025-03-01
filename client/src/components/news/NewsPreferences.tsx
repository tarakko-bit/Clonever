import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { UserNewsPreferences } from "@shared/schema";

const CATEGORIES = [
  "Bitcoin",
  "Ethereum",
  "DeFi",
  "NFTs",
  "Regulation",
  "Mining",
  "Trading",
  "Technology",
];

export function NewsPreferences() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery<UserNewsPreferences>({
    queryKey: ["/api/news/preferences/1"], // Mock user ID
  });

  const form = useForm({
    defaultValues: {
      categories: preferences?.categories || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: { categories: string[] }) => {
      const response = await fetch("/api/news/preferences/1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update preferences");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news/preferences/1"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news/recommended/1"] });
      toast({
        title: "Preferences updated",
        description: "Your news feed will be updated with your preferences.",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>News Preferences</CardTitle>
        <CardDescription>Choose the topics you're interested in</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-4">
                    {CATEGORIES.map((category) => (
                      <FormField
                        key={category}
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([...current, category])
                                    : field.onChange(current.filter((value) => value !== category));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {category}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
