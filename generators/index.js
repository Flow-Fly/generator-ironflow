const Generator = require("yeoman-generator");
const fs = require("fs-extra");
const { cowthink } = require("cowsayjs");
module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		// this.option("cloudinary", {
		// 	description: "Used to generate the cloudinary config",
		// 	alias: "c",
		// 	type: Boolean,
		// 	default: false,
		// });
	}

	initializing() {
		this.log(cowthink("Let's get this started!"));
		this.packages = {
			default: [
				"express",
				"bcryptjs",
				"cors",
				"jsonwebtoken",
				"mongoose",
				"morgan",
				"dotenv",
				"cowsayjs",
				"cloudinary",
				"multer-storage-cloudinary",
				"multer",
			],
			dev: ["nodemon"],
		};
	}

	async prompting() {
		this.userPrompt = await this.prompt([
			{
				type: "input",
				name: "folder",
				message: "Folder name: ('./' to install in the current folder)",
				default: "iron-server",
			},
			{
				type: "input",
				name: "name",
				message: "What is the name of your project?",
				default: "iron-project",
			},
		]);
	}

	async configuring() {
		this.destination =
			this.userPrompt.folder.trim() === "./"
				? ""
				: this.userPrompt.folder.trim();
		this.log(`Creating server in ${this.destinationPath(this.destination)}`);
		try {
			await fs.copy(this.sourceRoot(), this.destinationPath(this.destination));
			this.log(`Copied files from ${this.sourceRoot()}`);
		} catch (error) {
			this.log(`Error while copying template files: `, error);
		}
	}

	async writing() {
		this.env.cwd = this.destinationPath(this.destination);
		process.chdir(this.env.cwd);
		const packageJson = {
			name: this.userPrompt.name,
			version: "0.1.0",
			type: "module",
			description:
				"Project bootstraped @ironhack, let's now add a better description.",
			scripts: {
				dev: "nodemon app.js",
				start: "node app.js",
			},
		};
		this.log("before defaults");

		try {
			await fs.writeJSON(
				this.destinationPath(this.destination, "package.json"),
				packageJson
			);
			this.log("Finished writing the package.json");
		} catch (error) {
			this.log("Error while writing the package.json: ", error);
		}
	}

	async install() {
		this.log("Installing NPM packages, this can take a while");
		try {
			if (this.destination) {
				await this.spawnCommand("cd", [this.destination]);
			}

			await this.spawnCommand("npm", ["install", ...this.packages.default], {
				cwd: this.destinationPath(this.destination),
			});
			await this.spawnCommand("npm", ["install", "-D", ...this.packages.dev], {
				cwd: this.destinationPath(this.destination),
			});
		} catch (error) {
			console.log(error);
		}
	}

	end() {
		this.log("All done, happy hacking!");
	}
};
