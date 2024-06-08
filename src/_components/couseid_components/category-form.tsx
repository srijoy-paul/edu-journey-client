/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
  categoryid: string;
  setnewcoursefield: any;
  options:{label:string, value:string}[];
}

const formSchema = z.object({
 categoryid: z.string().min(1),
});

const CategoryForm = ({
  categoryid,
  options,
  setnewcoursefield,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      categoryid: categoryid || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

     const request = {  
    userid: null,
    title: null,
    description: null,
    imageurl: null,
    price: null,
    ispublished: null,
    categoryid: null,
    createdat: null,
    updatedat: null,}

    console.log('request=', request)
    
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/courses/${params.id}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const updatedDescription = await response.json();

      setnewcoursefield(updatedDescription);

      toast.success("Course updated");
      toggleEdit();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  // useEffect(() => {
  //   if (!description) {
  //     return;
  //   }

  //   form.reset({ description: description });
  // }, [form, description]);
const selectedOption = options.find((option)=>{
  option.value === categoryid
})
  return (
    <div className="mt-6 border p-4 bg-slate-100"> 
      <div>
        Course category
        <Button variant="ghost" onClick={toggleEdit}>
          {!isEditing ? (
            <>
              <Pencil className="h-4 w-4 mr-2 " />
              Edit category
            </>
          ) : (
            <>Cancel</>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !categoryid && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No category"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categoryid"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex item-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
export default CategoryForm;