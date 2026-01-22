using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthEco.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixDoctorScheduleFacilityNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorSchedules_MedicalFacilities_FacilityId",
                table: "DoctorSchedules");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_IsActive",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_IsEmailVerified",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_PhoneNumber",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Role",
                table: "Users");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "StartTime",
                table: "DoctorSchedules",
                type: "interval",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AlterColumn<int>(
                name: "FacilityId",
                table: "DoctorSchedules",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "EndTime",
                table: "DoctorSchedules",
                type: "interval",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorSchedules_MedicalFacilities_FacilityId",
                table: "DoctorSchedules",
                column: "FacilityId",
                principalTable: "MedicalFacilities",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorSchedules_MedicalFacilities_FacilityId",
                table: "DoctorSchedules");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "StartTime",
                table: "DoctorSchedules",
                type: "time",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");

            migrationBuilder.AlterColumn<int>(
                name: "FacilityId",
                table: "DoctorSchedules",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "EndTime",
                table: "DoctorSchedules",
                type: "time",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsActive",
                table: "Users",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsEmailVerified",
                table: "Users",
                column: "IsEmailVerified");

            migrationBuilder.CreateIndex(
                name: "IX_Users_PhoneNumber",
                table: "Users",
                column: "PhoneNumber",
                unique: true,
                filter: "[PhoneNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Role",
                table: "Users",
                column: "Role");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorSchedules_MedicalFacilities_FacilityId",
                table: "DoctorSchedules",
                column: "FacilityId",
                principalTable: "MedicalFacilities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
