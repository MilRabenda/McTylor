namespace McTylorAPI.Classes
{
    public class EmailSettings
    {
        public string smtpServer { get; set; } = "smtp.gmail.com";

        public int smtpPort { get; set; } = 587;

        public string smtpUser { get; set; } = "mctylorwebsite@gmail.com";

        public string smtpPass { get; set; } = "jxnmymgwxhvpipep";

        public EmailSettings() { }


    }
}
