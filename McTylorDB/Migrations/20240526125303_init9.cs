using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace McTylorDB.Migrations
{
    public partial class init9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReasonOfArchive",
                table: "ArchivedPhoto",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReasonOfArchive",
                table: "ArchivedPhoto");
        }
    }
}
