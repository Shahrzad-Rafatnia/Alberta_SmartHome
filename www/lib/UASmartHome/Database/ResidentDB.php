<?php namespace UASmartHome\Database;

class ResidentDB {



   public function Resident_DB_Read($resident_id)
	{
	
			   $result =array();
			   $conn=new Connection ();
		       $Query=$conn->connect()->prepare("select Name ,Username,Room_Number ,Location,
			   Points,Room_Status from Resident where Resident_ID=:Res_ID") ;
			   $Query->bindValue(":Res_ID",$resident_id);
			   $Query->execute();
			   $row = $Query->fetch(\PDO::FETCH_OBJ);
			   $result=(array)$row;
			   $a= $Query->rowCount();
			  // echo $a;
			   echo "<br \>";
				return $result;
	}
	public function Resident_Get_ResID($username)
	{
	
			   $result =array();
			   $conn=new Connection ();
		       $Query=$conn->connect()->prepare("select Resident_ID where Username= :US") ;
			   $Query->bindValue(":US",$username);
			   $Query->execute();
			   $row = $Query->fetch(\PDO::FETCH_OBJ);
			   $result=(array)$row;
			   $a= $Query->rowCount();
			  // echo $a;
			   echo "<br \>";
				return $result;
	}
	public function Resident_DB_Get_All_Residents()
	{
			   $result =array();
			   $conn=new Connection ();
		       $Query=$conn->connect()->prepare("select Resident_ID from Resident") ;
			   $Query->execute();
			   $row = $Query->fetchAll(\PDO::FETCH_COLUMN);
			   $result=(array)$row;
			   //$a= $Query->rowCount();
			   //echo $a;
			   //echo "<br \>";
				return $result;
	}
	   public function Resident_DB_Score($resident_id)
	{
			   $result =array();
			   $conn=new Connection ();
		       $Query=$conn->connect()->prepare("select Score from Resident where Resident_ID=:Res_ID") ;
			   $Query->bindValue(":Res_ID",$resident_id);
			   $Query->execute();
			   $row = $Query->fetch(\PDO::FETCH_OBJ);
			   $result=(array)$row;
			   $a= $Query->rowCount();
			  // echo $a;
			   echo "<br \>";
				return $result;
	}
	 
	
	public function Resident_DB_Update ($resident_id,$Room_Status,$Name,$Username)
	{ //update set where
	$conn=new Connection ();
	 $Query=$conn->connect()->prepare("update resident  
		set Room_Status= :RS , Name= :NM ,	Username= :US where Resident_ID= :Res_ID") ;
		$Query->bindValue(":Res_ID",$resident_id);
		$Query->bindValue(":RS",$Room_Status);
		$Query->bindValue(":NM",$Name);
		$Query->bindValue(":US",$Username);
		$Query->execute();
	}
	
	public 	function Resident_DB_Achievement ()
	{
			   $result =array();
			   $conn=new Connection ();
		       $Query=$conn->connect()->prepare("select `Name`, `Description`, `Enabled_Icon`, `Disabled_Icon`, `Points` from Achievements") ;
				$Query->execute();
				while ($row = $Query->fetch(\PDO::FETCH_OBJ))
				{
				$result[]=(array)$row;
				}
				return $result;
	}
	public 	function Resident_DB_Earned_Achievement ($resident_id)
	{
			   $result =array();
			   $conn=new Connection ();
		       $Query=$conn->connect()->prepare("select * from `Earned_Achievements` where Resident_ID= :Res_ID") ;
				$Query->bindValue(":Res_ID",$resident_id);
				$Query->execute();
				while ($row = $Query->fetch(\PDO::FETCH_OBJ))
				{
				$result[]=(array)$row;
				}
				return $result;
	}
	public 	function Resident_DB_Earned_Achievement_2 ($resident_id)
	{
			   $result =array();
			   $conn=new Connection ();
		        $Query=$conn->connect()->prepare("select Name,Description,Date_Earned,Enabled_Icon,Disabled_Icon,Points from `V_Achievements` where Resident_ID= :Res_ID") ;
				$Query->bindValue(":Res_ID",$resident_id);
				$Query->execute();
				while ($row = $Query->fetch(\PDO::FETCH_OBJ))
				{
				$result[]=(array)$row;
				}
				return $result;
	}
	
	
	public 	function Resident_DB_Building ($resident_id)
	{
			    $result =array();
				$conn=new Connection ();
		        $Query=$conn->connect()->prepare("select * from Building where Resident_ID= :Res_ID") ;
				$Query->bindValue(":Res_ID",$resident_id);
				$Query->execute();
				$row = $Query->fetch(\PDO::FETCH_OBJ);
				$result=(array)$row;
				$row_count= $Query->rowCount();
				$a= $Query->rowCount();
				return $result;
	}
	
	
}

// Example code
$testdb=new ResidentDB();
//Test Resident Read
/*
echo "Test Resident Read : By Passing the Resident ID::";
echo "<br>";
$a0=$testdb->Resident_DB_Read(1);
print_r($a0);
echo "<br>";
echo "===========================";
echo "<br>";

//Test Resident Update
echo "Test Resident Update : By Passing the Resident Id ,Room Status,Name,Username::";
echo "<br>";
$a1=$testdb->Resident_DB_Update (1,'TEST','TEST','TEST');
$a0=$testdb->Resident_DB_Read(1);
print_r($a0);
echo "<br>";
echo "===========================";
echo "<br>";
//Test READ ALL achievements 
echo "Test Read Achievements ::";
echo "<br>";
$a3=$testdb->Resident_DB_Achievement() ;
print_r($a3);
echo "<br>";
echo "===========================";
echo "<br>";
//Test Read Earned Achievments
echo "Test Earned Achievments by Passing Resident ID::";
echo "<br>";
$a4=$testdb->Resident_DB_Earned_Achievement(1);
print_r($a4);
echo "<br>";
echo "===========================";
echo "<br>";
//Test Read Acievment
echo "Test Read Earned Achievment 2 Apt# Info .By Passing Resident ID::";
echo "<br>";
$a5=$testdb->Resident_DB_Earned_Achievement_2 (1);
print_r($a5);
echo "<br>";
echo "===========================";
echo "<br>";
//Test Read Score
echo "Test Read Score Achievment Apt# Info .By Passing Resident ID::";
echo "<br>";
$a6=$testdb->Resident_DB_Score (1);
print_r($a6);
echo "<br>";
echo "===========================";
echo "<br>";

*/


?>
