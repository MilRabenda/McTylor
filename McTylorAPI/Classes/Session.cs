namespace McTylorAPI.Classes
{
    public static class Session
    {
        public static int Id { get; set; }

        public static int UserId { get; set; }

        public static string Token { get; set; }

        public static DateTime ExpiresAt { get; set; }
    }
}
