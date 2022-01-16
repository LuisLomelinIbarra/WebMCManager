import java.io.*;
public class mockserver{
    
    public static void main(String args[]){
        String read = "";
        System.out.println("----------------------------------------------------\nVanilla Server started!!!\n\n");
        try{
            
            BufferedReader rl = new BufferedReader(new InputStreamReader(System.in));
            BufferedWriter bw = new BufferedWriter(new FileWriter(new File("file.txt")));
            while(!read.equals("stop")){
                System.out.print("Waiting for cmd \n>> ");
                read = rl.readLine();
                System.out.println("Read::: " + read);
                bw.write("Read: "+read);

            }
            rl.close();
            bw.close();
        }catch(IOException ex){
            System.out.println("An Error has occurred");
        }
        
    }

}