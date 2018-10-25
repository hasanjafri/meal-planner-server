var methods = {
	mifflin: function(values) {
		var weight = values.weight;
		var height = values.height;
		if (values.weightUnit == 'kg') {
			weight = weight * 2.2;
		}
		if(values.heightUnit == 'cm') {
			height = height * 2.54;
		}

		if(values.gender == 'male') {
			return 4.54 * weight + 15.875 * height - 5 * values.age + 5;
		} else {
			return 4.54 * weight + 15.875 * height - 5 * values.age - 161;
		}
	}
}

function combineUserAssessment(user, assessment) {
	let details = angular.copy(assessment);
	details.height = user.height;
	details.heightUnit = user.heightUnit;
	details.gender = user.gender;
	details.bodyType = user.bodyType;
	details.age = helperService.ageFromDate(user.birthday);
	return details
}

function calculateTDEE(assessment, workoutDay) {
	var dailyActivityFactor = null;
	switch(assessment.dailyActivityLevel) {
		case "sedentary":
				dailyActivityFactor = 1.20;
				break;
		case "moderate":
				dailyActivityFactor = 1.25;
				break;
		case "active":
				dailyActivityFactor = 1.30;
				break;
		case "high":
				dailyActivityFactor = 1.35;
				break;
		default:
			dailyActivityFactor = 1.20;
	}
	var exerciseActivityFactor = null;
	switch(assessment.exerciseActivityLevel) {
		case "sedentary":
				exerciseActivityFactor = 3;
				break;
		case "moderate":
				exerciseActivityFactor = 6;
				break;
		case "active":
				exerciseActivityFactor = 9;
				break;
		case "high":
				exerciseActivityFactor = 12;
				break;
		default:
			exerciseActivityFactor = 6;
	}

	if (workoutDay) {
		return methods.mifflin(assessment) * dailyActivityFactor + exerciseActivityFactor * assessment.workoutLength;
	} else {
		return methods.mifflin(assessment) * dailyActivityFactor;
	}
}

function calculateCaloricGoal(user, assessment) {
	var surplusFactor = null;
	switch(assessment.goal) {
		case "fatLoss":
				surplusFactor = -1;
				break;
		case "maintain":
				surplusFactor = 0;
				break;
		case "weightGain":
				surplusFactor = 1;
				break;
		default:
			surplusFactor = 0;
	}
	var surplusRate = "conservative";
	var surplusRateFactor = null;
	switch(surplusRate) {
		case "conservative":
				surplusRate = 200;
				break;
		case "moderate":
				surplusRate = 350;
				break;
		case "aggressive":
				surplusRate = 500;
				break;
		case "extreme":
				surplusRate = 650;
				break;
		default:
			surplusRate = 200;
	}

	let workoutTDEE = Math.round(calculateTDEE(combineUserAssessment(user, assessment), true));
	let nonWorkoutTDEE = Math.round(calculateTDEE(combineUserAssessment(user, assessment), false));
	return (workoutTDEE * assessment.workoutFrequency + nonWorkoutTDEE * (7 - assessment.workoutFrequency)) / 7 + surplusFactor * surplusRate;

	// old calculation
	//return Math.round(calculateTDEE(combineUserAssessment(user, assessment), workoutDay) + surplusFactor * surplusRate);
}

function calculateMacros (user, assessment, workoutDay = false) {
		let final = {
			protein: null,
			fat: null,
			carbs: null
		}
		let weight = assessment.weight;
		let goalTDEE = calculateCaloricGoal(user, assessment);
		if(assessment.weightUnit == 'kg') {
			weight = weight * 2.2;
		}
		// Calculate Protein
		switch(assessment.goal) {
			case "fatLoss":
					final.protein = goalTDEE * 0.35 / 4;
					break;
			case "maintain":
					final.protein = goalTDEE * 0.30 / 4;
					break;
			case "weightGain":
					final.protein = goalTDEE * 0.28 / 4;
					break;
			default:
					final.protein = goalTDEE * 0.30 / 4;
		}

		// Calculate Fat
		switch(true) {
			case (assessment.goal == 'fatLoss' && workoutDay && assessment.bodyType == 'ectomorph'):
					final.fat = goalTDEE * 0.25 / 9;
					break;
			case (assessment.goal == 'fatLoss' && workoutDay && assessment.bodyType == 'mesomorph'):
					final.fat = goalTDEE * 0.3 / 9;
					break;
			case (assessment.goal == 'fatLoss' && workoutDay && assessment.bodyType == 'endomorph'):
					final.fat = goalTDEE * 0.35 / 9;
					break;
			case (assessment.goal == 'fatLoss' && !workoutDay && assessment.bodyType == 'ectomorph'):
					final.fat = goalTDEE * 0.30 / 9;
					break;
			case (assessment.goal == 'fatLoss' && !workoutDay && assessment.bodyType == 'mesomorph'):
					final.fat = goalTDEE * 0.35 / 9;
					break;
			case (assessment.goal == 'fatLoss' && !workoutDay && assessment.bodyType == 'endomorph'):
					final.fat = goalTDEE * 0.45 / 9;
					break;
			case (assessment.goal == 'maintain' && workoutDay && assessment.bodyType == 'ectomorph'):
					final.fat = goalTDEE * 0.2 / 9;
					break;
			case (assessment.goal == 'maintain' && workoutDay && assessment.bodyType == 'mesomorph'):
					final.fat = goalTDEE * 0.25 / 9;
					break;
			case (assessment.goal == 'maintain' && workoutDay && assessment.bodyType == 'endomorph'):
					final.fat = goalTDEE * 0.30 / 9;
					break;
			case (assessment.goal == 'maintain' && !workoutDay && assessment.bodyType == 'ectomorph'):
					final.fat = goalTDEE * 0.25 / 9;
					break;
			case (assessment.goal == 'maintain' && !workoutDay && assessment.bodyType == 'mesomorph'):
					final.fat = goalTDEE * 0.30 / 9;
					break;
			case (assessment.goal == 'maintain' && !workoutDay && assessment.bodyType == 'endomorph'):
					final.fat = goalTDEE * 0.35 / 9;
					break;
			case (assessment.goal == 'weightGain' && workoutDay && assessment.bodyType == 'ectomorph'):
					final.fat = goalTDEE * 0.20 / 9;
					break;
			case (assessment.goal == 'weightGain' && workoutDay && assessment.bodyType == 'mesomorph'):
					final.fat = goalTDEE * 0.25 / 9;
					break;
			case (assessment.goal == 'weightGain' && workoutDay && assessment.bodyType == 'endomorph'):
					final.fat = goalTDEE * 0.30 / 9;
					break;
			case (assessment.goal == 'weightGain' && !workoutDay && assessment.bodyType == 'ectomorph'):
					final.fat = goalTDEE * 0.25 / 9;
					break;
			case (assessment.goal == 'weightGain' && !workoutDay && assessment.bodyType == 'mesomorph'):
					final.fat = goalTDEE * 0.30 / 9;
					break;
			case (assessment.goal == 'weightGain' && !workoutDay && assessment.bodyType == 'endomorph'):
					final.fat = goalTDEE * 0.35 / 9;
					break;

			default:
				final.fat = goalTDEE * 0.25 / 9;
		}

		// Calculate Carbs
		final.carbs = (goalTDEE - (final.protein * 4) - (final.fat * 9)) /4;

		final.protein = Math.round(final.protein);
		final.fat = Math.round(final.fat);
		final.carbs = Math.round(final.carbs);

		return final
	}