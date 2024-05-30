using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace McTylorDB.Migrations
{
    public partial class init11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "User",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_User_CategoryId",
                table: "User",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Category_CategoryId",
                table: "User",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Category_CategoryId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_CategoryId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "User");
        }
    }
}
